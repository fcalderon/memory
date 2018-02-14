defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    IO.inspect(name)
    IO.inspect(payload)

    game = Memory.GameBackup.load(name) || Game.new()
    socket = socket
    |> assign(:game, game)
    |> assign(:name, name)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  def handle_in("reset", payload, socket) do
    newGame = Game.new()
    Memory.GameBackup.save(socket.assigns[:name], newGame)
    socket = assign(socket, :game, newGame)
    {:reply, {:ok, %{"game" => Game.client_view(newGame)}}, socket}
  end

  def handle_in("guess", %{"guess" => guess}, socket) do
    game = Game.guess(socket.assigns[:game], guess)
    Memory.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end
end
