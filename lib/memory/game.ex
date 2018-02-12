defmodule Memory.Game do
  def new do
    %{
      game: "in progress",
      clicks: 0
    }
  end

  def client_view() do
    %{
      game: "in progress",
      clicks: 0
    }
  end

  def guess(game) do
    Map.put(game, :clicks, game.clicks + 1)
  end

end
