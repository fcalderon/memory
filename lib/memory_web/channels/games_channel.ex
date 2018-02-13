defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    IO.puts("Joining game")
    game = Game.new()
    socket = socket
    |> assign(:game, game)
    |> assign(:name, name)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  def handle_in("guess", %{"guess" => guess}, socket) do
    IO.puts("Handling in")
    IO.inspect(guess)
    game = Game.guess(socket.assigns[:game], guess)
    IO.puts("Guess set")
    IO.inspect(game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}

#    socket = assign(socket, :game, game)
  end
end
